from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import pulp as plp


@api_view(['POST'])
def solve_optimization(request):
    data = request.data

    print(data)
    objective = data.get('objective')
    constraints = data.get('constraints')

    if not objective or not constraints:
        return Response({'error': 'Campos "Objective" e "Constraints" são obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
    
    prob = plp.LpProblem("Test", plp.LpMaximize)
    x1 = plp.LpVariable('x1', lowBound=0, cat='Float')
    x2 = plp.LpVariable('x2', lowBound=0, cat='Float')
    
    A = []
    b = []

    prob += objective['coef'][0]*x1 + objective['coef'][1]*x2 + objective['constant']
    for i, constraint in enumerate(constraints):
        exp = constraint['coef'][0]*x1 + constraint['coef'][1]*x2
        val = constraint['constant']
        op = constraint['operator']
    
        if op in ['>','>=']:
            prob += plp.LpConstraint(exp, 1, f"constraint_{i}", val)
        elif op == '=':
            prob += plp.LpConstraint(exp, 0, f"constraint_{i}", val)
        else:
            prob += plp.LpConstraint(exp, -1, f"constraint_{i}", val)
            
        A.append(constraint['coef'])
        b.append(val)

    brop = prob
    brop.setObjective
    prob.solve()
    
    optPoints = [x1.varValue, x2.varValue]

    # Criar lista de interseções
    vertices = []
    A = np.array(A)
    b = np.array(b)
    # Testar todas as combinações de 2 restrições (linhas de A)
    from itertools import combinations
    
    for i, j in combinations(range(len(A)), 2):
        A_sub = np.array([A[i], A[j]])
        b_sub = np.array([b[i], b[j]])
        try:
        # Resolver o sistema linear A_sub * [x, y] = b_sub
            ponto = np.linalg.solve(A_sub, b_sub)
            

        # Verificar se ponto satisfaz TODAS as desigualdades: A·ponto <= b
            if np.all(np.dot(A, ponto) <= b + 1e-5):  # +ε para tolerância numérica
                 vertices.append(tuple(float(coord) for coord in ponto))
        except np.linalg.LinAlgError:
            
        # Sistema singular (linhas paralelas ou iguais)
            continue

    for v in vertices:
        print(v)

    

    
    return Response({
        'status': plp.LpStatus[prob.status],
        'opt_value': plp.value(prob.objective),
        'vars' : { 
            'x1' : x1.varValue, 
            'x2' : x2.varValue 
        },
        'vertices' : vertices
            }, status=status.HTTP_200_OK)




    


      




